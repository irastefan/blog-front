import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { useNavigate, Navigate, useParams } from "react-router-dom";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');  
  const [tags, setTags] = React.useState('');  
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef();

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      const { data } = await axios.post('/upload', formData);
      setImageUrl(data.url);
      } catch (err) {
        console.warn(err);
    }
    console.log(event.target.files);
  };

  const onClickRemoveImage = async (event) => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        text,
        tags,
        imageUrl
      }

      const { data } = isEditing ?
       await axios.patch(`/post/${id}`, fields)
       :
       await axios.post('/post', fields);

      const _id = isEditing ? id :data._id;

      navigate(`/post/${_id}`);
      
      setLoading(false);
    } catch (err) {
      console.warm(err);
      alert('Create Post Error');
    }
  };

  React.useEffect(() => {
    if (id) {
      axios.get(`/post/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      });
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Description...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  console.log({title, tags, text});

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Upload preview
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Delete
        </Button>
        <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField 
        classes={{ root: styles.tags }} 
        variant="standard" 
        placeholder="Tags" 
        value={tags}
        onChange={e => setTags(e.target.value)}
        fullWidth 
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Edit' : 'Publish'}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
