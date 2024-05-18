import React, { useRef } from "react";

function NewWeeklyCard({ onFileRead }) {
  const uploadFile = useRef(null);

  const onButtonClick = () => {
    uploadFile.current.click();
  };

  const readFile = (e) => {
    const files = e.target.files;
    const acceptedExtensions = ['ics'];

    if (files && files.length) {
      const filename = files[0].name;
      const FullName = filename.split('.');
      const Extension = FullName[FullName.length - 1].toLowerCase();

      if (acceptedExtensions.includes(Extension)) {
        console.log("File accepted:", filename);
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;
          onFileRead(fileContent); // Pass file content to parent component
        };
        reader.readAsText(files[0]);
      } else {
        console.log("File not accepted. Only .ics files are allowed.");
      }
    }
  };

  return (
    <div className="NewWeeklyBody" onClick={onButtonClick}>
      <div className="AddCircle">+</div>
      <input
        type="file"
        ref={uploadFile}
        style={{ display: 'none' }}
        onChange={readFile}
      />
    </div>
  );
}

export default NewWeeklyCard;
