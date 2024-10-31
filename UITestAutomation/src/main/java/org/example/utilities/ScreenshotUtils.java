package org.example.utilities;
import java.io.File;
import java.nio.file.Files;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

public class ScreenshotUtils {
    public static String click(WebDriver driver, String fileName) throws Exception{

        File DestFile = null;
        String fileWithPath = "./target/screenshots/" + fileName;
        try {
            //Convert web driver object to TakeScreenshot
            TakesScreenshot scrShot =((TakesScreenshot)driver);

            //Call getScreenshotAs method to create image file
            File SrcFile=scrShot.getScreenshotAs(OutputType.FILE);

            //Move image file to new destination
            DestFile=new File(fileWithPath);

            //Copy file at destination
            Files.copy(SrcFile.toPath(), DestFile.toPath());
        }
        catch(Exception e) {
            e.printStackTrace();
            assert DestFile != null;
            System.out.println("Exception in capturing screenshot... File: " + DestFile.getAbsolutePath());
        }
        return fileWithPath;
    }
}