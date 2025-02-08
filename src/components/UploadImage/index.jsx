import React from "react";
import { CircularProgress } from "@material-ui/core";

const ImageComponent = (props: any) => {
  const { getRootProps, getInputProps, loadingAction } = props;
  const { action, loading } = loadingAction;

  return (
    <div
      {...getRootProps({ className: "dropzone" })}
      className="w-full h-48 rounded-lg border-dashed border border-sky-500"
    >
      <input
        type="image"
        {...getInputProps()}
        alt="description of image"
        className="w-full h-48 rounded-lg border-dashed border border-sky-500"
      />
      {loadingAction && (
        <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}
             className="h-48"
        >
          <CircularProgress
            size={25}
            style={{ color: "blue" }}
          />
        </div>
      )}
    </div>
  );
};
export default ImageComponent;
