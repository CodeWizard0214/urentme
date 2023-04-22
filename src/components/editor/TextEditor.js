import React, { useRef } from "react";

import { Editor } from "@tinymce/tinymce-react";

import * as Constant from "../../constants/constant";

const TextEditor = (props) => {
  const editorRef = useRef(null);
  return (
    <Editor
      apiKey={Constant.TINYMCE_TEXT_EDITOR_KEY}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      initialValue={props.contents}
      onChange={props.handleTextChange(editorRef.current?.getContent() ? editorRef.current?.getContent() : props.contents)}
      init={{
        height: 300,
        menubar: true,
        image_title: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste image code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor | image | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        file_picker_callback: function (cb, value, meta) {
          var input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.onchange = function () {
            var file = this.files[0];

            var reader = new FileReader();
            reader.onload = function () {
              var id = "blobid" + new Date().getTime();
              var blobCache = editorRef.current.editorUpload.blobCache;
              var base64 = reader.result.split(",")[1];
              var blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);

              /* call the callback and populate the Title field with the file name */
              cb(blobInfo.blobUri(), { title: file.name });
            };
            reader.readAsDataURL(file);
          };
          input.click();
        },
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
};

export default TextEditor;
