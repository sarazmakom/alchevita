import styled from "styled-components";
import { useSession, signIn, signOut } from "next-auth/react";
import { X } from "lucide-react";

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out;
`;

const MenuContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: white;
  z-index: 1001;
  transform: translateY(${({ isOpen }) => (isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  border-radius: 12px 12px 0 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const MenuContent = styled.div`
  padding: 4rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const MenuItem = styled.button`
  background: linear-gradient(135deg, #1fab89 0%, #178066 100%);
  border: none;
  padding: 1rem 2rem;
  text-align: center;
  font-size: 1.1rem;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 200px;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(31, 171, 137, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(31, 171, 137, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(31, 171, 137, 0.2);
  }
`;

export default function SlideInMenu({ isOpen, onClose }) {
  const { data: session } = useSession();

  const handleMenuItemClick = () => {
    onClose();
  };

  return (
    <>
      <MenuOverlay isOpen={isOpen} onClick={onClose} />
      <MenuContainer isOpen={isOpen}>
        <CloseButton onClick={onClose} aria-label="Close menu">
          <X size={24} />
        </CloseButton>
        <MenuContent>
          {session ? (
            <>
              <MenuItem
                onClick={() => {
                  signOut();
                  handleMenuItemClick();
                }}
              >
                Log Out
              </MenuItem>
            </>
          ) : (
            <MenuItem
              onClick={() => {
                signIn("github");
                handleMenuItemClick();
              }}
            >
              Log In
            </MenuItem>
          )}
        </MenuContent>
      </MenuContainer>
    </>
  );
}
