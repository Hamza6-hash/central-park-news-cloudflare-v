import styled from "styled-components";

interface TruncateProps {
  $lines: number;
}
const TruncateStyle = styled.p<TruncateProps> `
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $lines }) => $lines};
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5; /* Make sure this matches your actual line height */
  height: ${({ $lines }) => `calc(1.5em * ${$lines})`}; /* Dynamically calculate height based on the number of lines */
`;
const TruncateText = ({ content, lines = 3 }: { content: string; lines: number; }) => {
  return <TruncateStyle $lines={lines}>{content}</TruncateStyle>;
};
export default TruncateText;
