<?php
class Fieldtype_markitup extends Fieldtype
{

  public function render()
  {
    $base_url   = Config::getSiteRoot().'TRIGGER/markitup/upload';

    // build file url
    $file_path  = Path::tidy(array_get($this->field_config, 'file_dir').'/');
    $file_url   = "{$base_url}?path={$file_path}";

    // build image url
    $image_path = Path::tidy(array_get($this->field_config, 'image_dir').'/');
    $image_options = array('path' => $image_path, 'is_image' => true);
    $resize_options = array_get($this->field_config, 'resize', array());
    if (count($resize_options)) {
      $image_options['resize'] = true;
      $image_options += $resize_options;
    }
    $image_options_string = http_build_query($image_options);
    $image_url  = "{$base_url}?{$image_options_string}";

    // build field
    $height = isset($this->field_config['height']) ? $this->field_config['height'].'px' : '300px';
    $html = "
      <textarea
        name='{$this->fieldname}'
        style='height:{$height}'
        tabindex='{$this->tabindex}'
        class='input-textarea markitup'
        data-image-url='{$image_url}'
        data-file-url='{$file_url}'
      >{$this->field_data}</textarea>";

    return $html;
  }

}
