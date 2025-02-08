import { useState, useEffect } from "react";

export const S3Image = ({ url, className, defaultImage = null }) => {
  return <img style={{width: '100%'}} alt="default-image" className={className} src={url || defaultImage} />
};

export default S3Image;
