<?php

use Intervention\Image\Image;

class Hooks_markitup extends Hooks
{
    public function markitup__upload()
    {
        if (!Auth::getCurrentMember()) {
            exit("Invalid Request");
        }

        $path = Request::get('path');
        $is_image = Request::get('is_image');

        if (isset($path)) {

            // build directory
            $dir = Path::tidy(ltrim($path, '/').'/');

            $file_type = strtolower($_FILES['file']['type']);
            $file_info = pathinfo($_FILES['file']['name']);

            // pull out the filename bits
            $filename = $file_info['filename'];
            $ext = $file_info['extension'];

            // build filename
            $file = $dir.$filename.'.'.$ext;

            // check for dupes
            if (File::exists($file)) {
                $file = BASE_PATH . '/' . $dir.$filename.'-'.date('YmdHis').'.'.$ext;
            }

            if ( ! Folder::isWritable($dir)) {
                $this->log->error('Upload failed. Directory "' . $dir . '" is not writable.');
                die('Upload directory not writable');
            }

            if ($is_image && (
                $_FILES['file']['type'] == 'image/png' || $_FILES['file']['type'] == 'image/jpg' || $_FILES['file']['type'] == 'image/gif' || $_FILES['file']['type'] == 'image/jpeg')) {

                if (Request::get('resize', false)) {

                    $image = Image::make($_FILES['file']['tmp_name']);

                    $width   = Request::get('width', null);
                    $height  = Request::get('height', null);
                    $ratio   = Request::get('ratio', true);
                    $upsize  = Request::get('upsize', false);
                    $quality = Request::get('quality', '75');

                    $image->resize($width, $height, $ratio, $upsize)
                          ->save($file, $quality);

                } else {
                    move_uploaded_file($_FILES['file']['tmp_name'], $file);
                }

            } else {
                move_uploaded_file($_FILES['file']['tmp_name'], $file);
            }

            $return = array('filelink' => Path::toAsset($file));

            die(stripslashes(json_encode($return)));

        } else {
            die('Upload directory not set.');
        }
    }

    public function control_panel__add_to_foot()
    {
        return '
            <div id="markituploader" class="markituploader" style="display:none;">
                <div class="modal">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h3>Upload a file</h3>
                    </div>
                    <div class="modal-body">
                        <div id="miu-dropzone" class="miu-dropzone">
                            <span class="ss-icon">attach</span>
                            <b>Drag a file here to upload it</b>
                        </div>
                        <input type="file" name="file" id="miu-file" class="miu-file" />
                        <p>
                            <label><span class="alt-label">Alt</span> Text:</label>
                            <input type="text" class="alt-text" />
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-small">Insert</button>
                    </div>
                </div>
            </div>
        ';
    }
}
