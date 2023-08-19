import "./PhotoItem.css";
import "./TextEditor.css";

import { uploads } from "../utils/config";

import { Link } from "react-router-dom";

import JoditEditor from "jodit-react";

const configTextEditor = {
  readonly: true,
  height : 400,
  buttons: false,
};

const PhotoItem = ({ photo }) => {
  return (
    
    <div className="photo-item">
       <h2>{photo.title}</h2>
      {photo.image && (
        <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
      )}
      <p className="photo-content">
        Conteúdo científico: {" "} 
        {(<div className="text-editor" >
               <JoditEditor 
                  value={photo.scientificContent}
                  config={configTextEditor}
                />
        </div>)}
      </p>
      <p className="photo-author">
        Publicada por:{" "}
        <Link to={`/users/${photo.userId}`}>{photo.userName} </Link>
      </p>
    </div>
  );
};

export default PhotoItem;
