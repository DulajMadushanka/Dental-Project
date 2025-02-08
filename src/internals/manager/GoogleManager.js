export const KEY = "AIzaSyDRfs6SMZvKl10Sayaq0d8UjhRo0vR3tuA";

export const getPhotoFromRef = (ref) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${KEY}`;
};
