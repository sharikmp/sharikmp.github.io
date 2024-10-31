package org.example.utilities;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class PropertyReader {
    private String fileName;
    private Properties prop;

    public PropertyReader(String fileName) {
        this.fileName = fileName;
        loadProperty();
    }

    /**
     * Constructor
     */
    private void loadProperty() {
        prop = null;
        FileInputStream fis = null;
        try {
            fis = new FileInputStream(fileName);
            prop = new Properties();
            prop.load(fis);
        } catch(IOException ioe) { ioe.printStackTrace(); } finally { try {	if(fis != null) fis.close();} catch (IOException e) {e.printStackTrace();} }
    }



    /**
     * Get Property
     * @param key
     * @return
     * @throws IOException
     */
    public String getProperty(String key) throws IOException {
        if(prop == null) loadProperty();
        return prop.getProperty(key);
    }
}
