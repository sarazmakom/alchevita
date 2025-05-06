import { useState } from "react";
import styled from "styled-components";

const BookmarkButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 100%;
    height: 100%;
    fill: ${(props) => (props.bookmarked ? "red" : "white")};
    stroke: red;
    stroke-width: 2px;
  }

  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
    top: 0.25rem;
    right: 0.25rem;
  }
`;

export default function BookMarkbutton({ initial = false, onToggle }) {
  const [bookmarked, setBookmarked] = useState(initial);

  const toggle = (e) => {
    e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next);
    if (onToggle) onToggle(next);
  };

  return (
    <BookmarkButton
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      bookmarked={bookmarked}
      onClick={toggle}
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </BookmarkButton>
  );
}
