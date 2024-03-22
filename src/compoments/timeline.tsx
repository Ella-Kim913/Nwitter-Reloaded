import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { db } from "../firsbase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
import { limitToFirst } from "firebase/database";

export interface ITweet {
    id: string;
    photo?: string; //optional
    tweet: string;
    userId: string;
    username: string;
    createAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y:scroll;
`;


export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "Tweet"),
                orderBy("createAt", "desc"),
                limit(25)
            )
            //const snapshot = await getDocs(tweetsQuery);
            // const tweets = snapshot.docs.map((doc) => {
            //     const { tweet, createAt, userId, username, photo } = doc.data();
            //     return {
            //         tweet, createAt, userId, username, photo,
            //         id: doc.id,
            //     }
            // });

            //instead of getting the docs in ONE SINGLE TIME, 
            //add the EventListener to the Quart,
            //therefore whenever there is an update
            //tweet can be updated
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map((doc) => {
                    const { tweet, createAt, userId, username, photo } = doc.data();
                    return {
                        tweet, createAt, userId, username, photo,
                        id: doc.id,
                    }
                })
                setTweet(tweets);

            })

        }
        fetchTweets();
        return () => {
            unsubscribe && unsubscribe(); //only listen when users are currenlty on the page
        }
    }, []);

    return <Wrapper>
        {tweets.map((tweet) => (
            <Tweet key={tweet.id}{...tweet} />
        )
        )}
    </Wrapper>
}