package org.example.utilities;

import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.FileOutputStream;


public class ExcelReader {

    public  String path;
    public  FileInputStream fis = null;
    public  FileOutputStream fileOut =null;
    private XSSFWorkbook workbook = null;
    private XSSFSheet sheet = null;
    private XSSFRow row = null;
    private XSSFCell cell = null;

    public ExcelReader(String path) {

        this.path=path;
        try {
            fis = new FileInputStream(path);
            workbook = new XSSFWorkbook(fis);
            sheet = workbook.getSheetAt(0);
            fis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }


    // returns the row count in a sheet
    public int getRowCount(String sheetName){
        int index = workbook.getSheetIndex(sheetName);
        if(index==-1)
            return 0;
        else{
            sheet = workbook.getSheetAt(index);
            int number=sheet.getLastRowNum()+1;
            return number;
        }

    }




    /**
     * Method to get cell data based on
     * Sheet name, column name and row number
     *
     * @param sheetName
     * @param colName
     * @param rowNum
     * @return cell data
     */
    public String getCellData(String sheetName, String colName, int rowNum){
        try{

            //STEP1: IF INVALID ROW RETURN BLANK STRING
            if(rowNum <= 0) return "";

            //STEP2: IF INVALID SHEET RETURN BLANK STRING
            int index = workbook.getSheetIndex(sheetName);
            if(index == -1) return "";

            //STEP 3: GET SHEET
            sheet = workbook.getSheetAt(index);

            //STEP 4: GET FIRST ROW TO CHECK IF GIVEN COLUMN EXISTS & IF GIVEN COLUMN DOESN'T EXIST, RETURN BLANK STRING
            row = sheet.getRow(0);
            int col_Num = -1;		//ASSUME COLUMN DOESN'T EXIST
            for(int i = 0; i < row.getLastCellNum(); i++){
                if(row.getCell(i).getStringCellValue().trim().equals(colName.trim())) {
                    col_Num=i;
                    break;
                }
            }
            if(col_Num==-1) return "";

            //STEP 6: GET GIVEN ROW & IF THE GIVEN ROW DOESBN'T EXIST RETURN BLANK
            row = sheet.getRow(rowNum-1);
            if(row==null) return "";

            //STEP 7: GET GIVEN CELL & IF THE GIVEN CELL DOESBN'T EXIST RETURN BLANK
            cell = row.getCell(col_Num);
            if(cell==null) return "";

            //STEP 8: RETURN DATA FROM THE GIVEN CELL
            if(cell.getCellType()==CellType.STRING) {
                return cell.getStringCellValue();
            }
            else if(cell.getCellType()==CellType.NUMERIC ){
                String cellText  = String.valueOf(cell.getNumericCellValue());
                return cellText;
            }
            else if(cell.getCellType()==CellType.BLANK)
                return "";
            else
                return String.valueOf(cell.getBooleanCellValue());

        }
        catch(Exception e){	e.printStackTrace(); return "row "+rowNum+" or column "+colName +" does not exist in file"; }
    }



    /**
     * Method to get cell data based on sheet name, column number and row number
     * @param sheetName
     * @param colNum
     * @param rowNum
     * @return cell data
     */
    public String getCellData(String sheetName,int colNum,int rowNum){
        try{

            //STEP1: IF INVALID ROW RETURN BLANK STRING
            if(rowNum <= 0) return "";

            //STEP2: IF INVALID SHEET RETURN BLANK STRING
            int index = workbook.getSheetIndex(sheetName);
            if(index == -1) return "";

            //STEP 3: GET SHEET
            sheet = workbook.getSheetAt(index);

            if(colNum==-1) return "";

            //STEP 6: GET GIVEN ROW & IF THE GIVEN ROW DOESBN'T EXIST RETURN BLANK
            row = sheet.getRow(rowNum-1);
            if(row==null) return "";

            //STEP 7: GET GIVEN CELL & IF THE GIVEN CELL DOESBN'T EXIST RETURN BLANK
            cell = row.getCell(colNum);
            if(cell==null) return "";

            //STEP 8: RETURN DATA FROM THE GIVEN CELL
            if(cell.getCellType()==CellType.STRING) {
                return cell.getStringCellValue();
            }
            else if(cell.getCellType()==CellType.NUMERIC ){
                String cellText  = String.valueOf(cell.getNumericCellValue());
                if(cellText.endsWith(".0")) cellText = cellText.substring(0, cellText.length()-2);
                return cellText;
            }
            else if(cell.getCellType()==CellType.BLANK)
                return "";
            else
                return String.valueOf(cell.getBooleanCellValue());

        }
        catch(Exception e){	e.printStackTrace(); return "row: "+rowNum+" or column: "+colNum +" does not exist in file"; }
    }




    // returns true if data is set successfully else false
    public boolean setCellData(String sheetName,String colName,int rowNum, String data){
        try{
            fis = new FileInputStream(path);
            workbook = new XSSFWorkbook(fis);

            if(rowNum<=0)
                return false;

            int index = workbook.getSheetIndex(sheetName);
            int colNum=-1;
            if(index==-1)
                return false;

            sheet = workbook.getSheetAt(index);

            row=sheet.getRow(0);
            for(int i=0;i<row.getLastCellNum();i++){
                if(row.getCell(i).getStringCellValue().trim().equals(colName))
                    colNum=i;
            }
            if(colNum==-1)
                return false;

            sheet.autoSizeColumn(colNum);
            row = sheet.getRow(rowNum-1);
            if (row == null)
                row = sheet.createRow(rowNum-1);

            cell = row.getCell(colNum);
            if (cell == null)
                cell = row.createCell(colNum);


            cell.setCellValue(data);

            fileOut = new FileOutputStream(path);

            workbook.write(fileOut);

            fileOut.close();

        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }


    // returns true if sheet is created successfully else false
    public boolean addSheet(String  sheetname){

        FileOutputStream fileOut;
        try {
            workbook.createSheet(sheetname);
            fileOut = new FileOutputStream(path);
            workbook.write(fileOut);
            fileOut.close();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }


    // returns true if sheet is removed successfully else false if sheet does not exist
    public boolean removeSheet(String sheetName){
        int index = workbook.getSheetIndex(sheetName);
        if(index==-1)
            return false;

        FileOutputStream fileOut;
        try {
            workbook.removeSheetAt(index);
            fileOut = new FileOutputStream(path);
            workbook.write(fileOut);
            fileOut.close();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }



    // find whether sheets exists
    public boolean isSheetExist(String sheetName){
        int index = workbook.getSheetIndex(sheetName);
        if(index==-1){
            index=workbook.getSheetIndex(sheetName.toUpperCase());
            if(index==-1)
                return false;
            else
                return true;
        }
        else
            return true;
    }



    // returns number of columns in a sheet
    public int getColumnCount(String sheetName){
        // check if sheet exists
        if(!isSheetExist(sheetName))
            return -1;

        sheet = workbook.getSheet(sheetName);
        row = sheet.getRow(0);

        if(row==null)
            return -1;

        return row.getLastCellNum();
    }


    public int getCellRowNum(String sheetName,String colName,String cellValue){

        for(int i=2;i<=getRowCount(sheetName);i++){
            if(getCellData(sheetName,colName , i).equalsIgnoreCase(cellValue)){
                return i;
            }
        }
        return -1;

    }


    public String vLookup(
            String sheetName,
            String lookupValue,
            int startRowNum,
            int lastRowNum,
            int startColNum,
            int lastColNum,
            int searchColNum) {
        /****
         * Logic goes here
         *
         */
        for(int i = startRowNum; i < lastRowNum; i++) {
            for(int j = startColNum-1; j <= lastColNum; j++) {
                String actual = getCellData(sheetName, j, i);
                if(lookupValue.equals(actual))
                    return getCellData(sheetName, searchColNum-1, i);
            }
        }


        return "NA";
    }


}
