import { useRef, useState }from "react"; 
import JoditEditor from "jodit-react";

import './TextEditor2.css';

const TextEditor2 = () => {

    const editor = useRef(null);
    const [content, setContent] = useState('');

    const config = {
        readonly: false,
        height : 400
    };

    const handleUpdateTextEdit = (event) => {
        const editorContent = event.target.value;
        setContent(editorContent);
        console.log(editorContent);
    };


    return (
        <div className="TextEditor2">
            <JoditEditor 
                ref={editor}
                value={content}
                config={config}
                onBlur={handleUpdateTextEdit}
                onChange={(newContent) => {}}
            />
        </div>
    )
}

export default TextEditor2;

