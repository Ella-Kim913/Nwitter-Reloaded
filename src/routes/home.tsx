import styled from "styled-components";
import PostTweetForm from "../compoments/post-tweet.form";

const Wrapper = styled.div``;

export default function Home() {

    return (
        <Wrapper>
            <PostTweetForm></PostTweetForm>
        </Wrapper>
    );
}