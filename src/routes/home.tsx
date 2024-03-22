import styled from "styled-components";
import PostTweetForm from "../compoments/post-tweet.form";
import Timeline from "../compoments/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
  ::-webkit-scrollbar {
    display:none;
    }
`;

export default function Home() {

    return (
        <Wrapper>
            <PostTweetForm />
            <Timeline />
        </Wrapper>
    );
}