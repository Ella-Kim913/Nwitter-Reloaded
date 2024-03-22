import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firsbase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import EditTweetForm from "./edit-tweet-form";
import { useState } from "react";

interface WrapperProps {
    hasphoto: boolean;
}


const Wrapper = styled.div<WrapperProps>`
  display: grid;
  grid-template-columns: ${(props) => (props.hasphoto ? "3fr 1fr" : "1fr")};
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
&[id="photo"] {
    display:flex;
    justify-content: center;
    align-items:center;
`;

const Row = styled.div`
    display:flex;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;


`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteBtn = styled.button`
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

const EditBtn = styled.button`
margin-left:7px;
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


export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");

        if (!ok || user?.uid !== userId) return;

        try {
            await deleteDoc(doc(db, "Tweet", id))
            if (photo) {
                const photoRef = ref(storage, `Tweets/${user.uid}-${username}/${id}`)
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    }

    const onEdit = async () => {

        if (user?.uid !== userId) return;
        setIsEditing((prev) => !prev);
        try {

        } catch (e) {
            console.log(e);
        } finally {
        }
    }


    return <Wrapper hasphoto={!!photo}>
        <Column>
            <Username>{username}</Username>
            {isEditing ? (
                <EditTweetForm
                    tweet={tweet}
                    photo={photo}
                    id={id}
                    setIsEditing={setIsEditing}
                />
            ) : (
                <Payload>{tweet}</Payload>
            )}
            <Row>
                {user?.uid === userId ? <DeleteBtn onClick={onDelete}>Delete</DeleteBtn> : null
                }
                {user?.uid === userId ? <EditBtn onClick={onEdit}>{isEditing ? "Cancel" : "Edit"}
                </EditBtn> : null
                }
            </Row>
        </Column>
        {photo ? <Column id="photo">

            <Photo src={photo} />

        </Column> : null}


    </Wrapper>
}

