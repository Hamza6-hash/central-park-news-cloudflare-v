// import styled from "styled-components";

// interface TruncateProps {
//     lines: number;
// }
// const TruncateStyle = styled.p<TruncateProps> `
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   -webkit-line-clamp: ${({ lines }) => lines};
//   overflow: hidden;
//   text-overflow: ellipsis;
//   line-height: 1.5; /* Make sure this matches your actual line height */
//   height: ${({ lines }) => `calc(1.5em * ${lines})`}; /* Dynamically calculate height based on the number of lines */
// `;
const TruncateText = ({
  content,
  lines = 3,
}: {
  content: string;
  lines: number;
}) => {
  // This mapping is safe for Tailwind's JIT compiler, as it doesn't use dynamic class name concatenation.
  const lineClampClass = lines === 2 ? "line-clamp-2" : "line-clamp-3";
  return <p className={lineClampClass}>{content}</p>;
};
export default TruncateText;
