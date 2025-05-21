import Link from "next/link";
import styled from "styled-components";
import { StyledImage } from "../StyledImage/StyledImage";
import SymptomsList from "../SymptomsList/SymptomsList";
import BookMarkButton from "../BookmarkButton/BookmarkButton";
import { useBookmarks } from "@/hooks/useBookmarks";

const CardContainer = styled.li`
  position: relative; /* <-- ensure absolute children (bookmark) are positioned correctly */
  border: 1px solid black;
  border-radius: 0.8rem;
  padding: 1.5rem;
  background-color: var(--background);
`;

const ImageContainer = styled.div`
  position: relative;
  height: 10rem;
  margin-bottom: 20px;
`;

export default function Card({ remedy, currentPath }) {
  const { toggle } = useBookmarks();
  return (
    <CardContainer>
      <ImageContainer>
        <BookMarkButton
          bookmarked={remedy.isBookmarked}
          onToggle={() => toggle(remedy._id, remedy.isBookmarked, currentPath)}
        />
        <Link
          href={`remedies/${remedy._id}`}
          aria-label={`View details for ${remedy.title}`}
        >
          <StyledImage
            src={remedy.imageUrl}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={`Visual representation of ${remedy.title}`}
          />
        </Link>
      </ImageContainer>

      <h3>{remedy.title}</h3>
      <SymptomsList symptoms={remedy.symptoms} currentPath={currentPath} />
    </CardContainer>
  );
}
