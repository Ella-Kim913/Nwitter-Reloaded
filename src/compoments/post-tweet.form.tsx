import { addDoc, collection, updateDoc } from "firebase/firestore";
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
  border: 2px solid #9C92A3;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: #0B3142;
  background-color: white;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #0B3142;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #0B3142;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #0B3142;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #0B3142;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const maxFileSize = 1024 ** 2; // 1MB

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1 && files[0].size <= maxFileSize) {
      setFile(files[0]);
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 150) return;

    try {
      setLoading(true);
      const document = await addDoc(collection(db, "Tweet"), { //add the new tweet into the db and get as a document ref at the same time
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Annoymous",
        userId: user.uid,
      });
      if (file) {
        const location = ref(storage, `Tweets/${user.uid}-${user.displayName}/${document.id}`) //save the picture into the db and get the location at the same time
        const result = await uploadBytes(location, file) //get the reference of the result
        const url = await getDownloadURL(result.ref); //use the reference to get the physical url
        await updateDoc(document, {
          photo: url // update the docs with the photo url
        })
      }
      setTweet("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }

  }

  return <Form onSubmit={onSubmit}>
    <TextArea required onChange={onChange} value={tweet} rows={5} maxLength={180} placeholder="What is happening?" />
    <AttachFileButton htmlFor="file">{file ? "Photo added" : "Add Photo"}</AttachFileButton>
    <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
    <SubmitBtn type="submit" value={isLoading ? "Posting" : "Post Tweet"} />
  </Form>
}