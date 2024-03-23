import styled from "styled-components";
import { auth, db, storage } from "../firsbase"
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../compoments/timeline";
import Tweet from "../compoments/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;


const NameInput = styled.textarea`
  //border: 2px solid white;
  padding: 10px;
  border-radius: 20px;
  font-size: 17px;
  color: white;
  background-color: black;
  width: 80%;
  

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

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
    display:flex;
    margin-top:5px;
    justify-content: space-evenly;
`;


const EditBtn = styled.button`
background-color: white;
color: tomato;
font-weight: 600;
border: 0;
font-size: 12px;
padding: 5px 10px;
text-transform: uppercase;
border-radius: 5px;
cursor: pointer;
`;

const ConfirmBtn = styled.input`

  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const Form = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
`;



export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [name, setName] = useState(user?.displayName);
    const [isEditing, setIsEditing] = useState(false);

    const onAvatorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `avators/${user?.uid}`) //override to the user's id when user update
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);

            setAvatar(avatarUrl);

            await updateProfile(user, {
                photoURL: avatarUrl,
            })
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setName(e.target.value)
    }

    const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsEditing((prev) => !prev);
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        try {
            if (name && name.length > 0 && name.length < 20) {
                await updateProfile(user, { displayName: name });
            } else {
                alert("Please enter a name that is between 1 and 20 characters long.");
            }
        }
        catch (e) {
            console.log(e);
            alert("An error occurred while updating the profile. Please try again.");

        }
        finally {
            setIsEditing(false);
        }


    }

    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db, "Tweet"),
            where("userId", "==", user?.uid), //Will bring the index error from the firebase, need to create the index to user the filter for the first time
            orderBy("createAt", "desc"),
            limit(25),
        )
        const snapshot = await getDocs(tweetsQuery);
        const tweets = snapshot.docs.map((doc) => {
            const { tweet, createAt, userId, username, photo } = doc.data();
            return {
                tweet, createAt, userId, username, photo,
                id: doc.id,
            };
        });
        setTweets(tweets);

    }
    useEffect(() => { fetchTweets() }, []);

    return <Wrapper>
        <AvatarUpload htmlFor="avator">
            {avatar ? <AvatarImg src={avatar} /> : <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
            </svg>}
        </AvatarUpload>
        <AvatarInput onChange={onAvatorChange} id="avator" type="file" accept="image/*" />


        <Form onSubmit={onSubmit}>
            {isEditing ? <NameInput onChange={onChange}></NameInput> : <Name>
                {user?.displayName ? user.displayName : "Anonymous"}
            </Name>}

            <Row>
                {isEditing ? <ConfirmBtn type="submit" value="Change" /> : null}
                <EditBtn type="button" onClick={onEdit}>{isEditing ? "Cancel" : "Change Name"}</EditBtn>
            </Row>

        </Form>


        <Tweets>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id}{...tweet} />
            ))}
        </Tweets>
    </Wrapper>
}