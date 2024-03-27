import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firsbase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  margin-top:10px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: #D6D3F0;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  margin-bottom:10px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

interface EditTweetFormProps {
  tweet: string; // Assuming tweet is a string
  photo?: string; // Assuming photo is a string URL
  id: string; // Assuming id is a string
  setIsEditing: (isEditing: boolean) => void; // Assuming setIsEditing is a function that accepts a boolean
}


export default function EditTweetForm({ tweet, photo, id, setIsEditing }: EditTweetFormProps) {
  const [isLoading, setLoading] = useState(false);
  const [edittweet, seteditTweet] = useState(tweet);
  const [editFile, seteditFile] = useState<File | null>(null);
  const maxFileSize = 1024 ** 2; // 1MB

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    seteditTweet(e.target.value)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size <= maxFileSize) {
      seteditFile(files[0]);
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > maxFileSize) return;

    try {
      setLoading(true);
      const tweetRef = doc(db, "Tweet", id)

      await updateDoc(tweetRef, {
        tweet: edittweet, // update the docs with the photo url
      })



      if (editFile) {
        const location = ref(storage, `Tweets/${user.uid}-${user.displayName}/${tweetRef.id}`) //save the picture into the db and get the location at the same time
        const result = await uploadBytes(location, editFile) //get the reference of the result
        const url = await getDownloadURL(result.ref); //use the reference to get the physical url
        await updateDoc(tweetRef, {
          photo: url // update the docs with the photo url
        })
      }
      seteditTweet("");
      seteditFile(null);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }

  }

  return <Form onSubmit={onSubmit}>
    <TextArea required onChange={onChange} value={edittweet} rows={5} maxLength={180} placeholder="What is happening?" />
    {photo ? <AttachFileButton htmlFor={"editFile${id}"}>{editFile ? "Photo Edited" : "Edit Photo"}</AttachFileButton> : null}
    <AttachFileInput onChange={onFileChange} type="file" id={"editFile${id}"} accept="image/*" />
    <SubmitBtn type="submit" value={isLoading ? "Editing" : "Edit Tweet"} />
  </Form>
}