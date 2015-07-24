<?php

class _Upload
{
    private static $files = array();
    
    /**
     * Grabs the contents of $_FILES and inserts a standardized array of them into $_POST
     * 
     * @return void
     */
    public static function standardizeFileUploads()
    {
        if (!count($_FILES)) {
            return;
        }
        
        // loop through files to standardize
        foreach ($_FILES as $field => $data) {
            if (!isset(self::$files[$field]) || !is_array(self::$files[$field])) {
                self::$files[$field] = array();
            }

            $data = array(
                'name'      => $data['name'],
                'type'      => $data['type'],
                'tmp_name'  => $data['tmp_name'],
                'size'      => $data['size'],
                'error'     => $data['error']
            );
            
            // loop through _FILES to standardize
            foreach ($data as $key => $value) {
                self::buildFileArray($key, $value, self::$files[$field], $field);
            }
        }
        
        // overwrite $_FILES with our cleaner version
        $_FILES = self::$files;
    }


    /**
     * Recursively builds an array of files
     * 
     * @param string  $key  Upload key that we're processing
     * @param mixed  $value  Either a string or an array of the value
     * @param array  $output  The referenced array object for manipulation
     * @param string  $path  A string for colon-delimited path searching
     * @return void
     */
    private static function buildFileArray($key, $value, &$output, $path)
    {
        if (is_array($value)) {
            foreach ($value as $sub_key => $sub_value) {
                if (!isset($output[$sub_key]) || !is_array($output[$sub_key])) {
                    $output[$sub_key] = array();
                }
                $new_path = (empty($path)) ? $sub_key : $path . ':' . $sub_key;
                self::buildFileArray($key, $sub_value, $output[$sub_key], $new_path);
            }
        } else {
            $output[$key] = $value;

            // add error message
            if ($key === 'error') {
                $error_message   = self::getFriendlyErrorMessage($value);
                $success_status  = ($value === UPLOAD_ERR_OK);
                    
                $output['error_message'] = $error_message;
                $output['success']       = $success_status;
            } elseif ($key === 'size') {
                $human_readable_size = File::getHumanSize($value);
                $output['size_human_readable'] = $human_readable_size;
            }
        }
    }
    
    
    /**
     * Create friendly error messages for upload issues
     * 
     * @param int  $error  Error int
     * @return string
     */
    private static function getFriendlyErrorMessage($error)
    {
        // these errors are PHP-based
        if ($error === UPLOAD_ERR_OK) {
            return '';
        } elseif ($error === UPLOAD_ERR_INI_SIZE) {
            return Localization::fetch('upload_error_ini_size');
        } elseif ($error === UPLOAD_ERR_FORM_SIZE) {
            return Localization::fetch('upload_error_form_size');
        } elseif ($error === UPLOAD_ERR_PARTIAL) {
            return Localization::fetch('upload_error_err_partial');
        } elseif ($error === UPLOAD_ERR_NO_FILE) {
            return Localization::fetch('upload_error_no_file');
        } elseif ($error === UPLOAD_ERR_NO_TMP_DIR) {
            return Localization::fetch('upload_error_no_temp_dir');
        } elseif ($error === UPLOAD_ERR_CANT_WRITE) {
            return Localization::fetch('upload_error_cant_write');
        } elseif ($error === UPLOAD_ERR_EXTENSION) {
            return Localization::fetch('upload_error_extension');
        } else {
            // we should never, ever see this
            return Localization::fetch('upload_error_unknown');
        }
    }
}