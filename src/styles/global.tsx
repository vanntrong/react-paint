// export const Container =
import styled from "styled-components";
export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #4a98f7;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AppContainer = styled.div`
  width: 100%;
  max-width: 1050px;
  height: 600px;
  padding: 10px;
  display: flex;
  gap: 12px;
`;

export const ToolBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
`;

export const Label = styled.label`
  font-size: 20px;
`;

export const GroupOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${(props: { active?: boolean }) =>
    props.active ? "#4a98f7" : "black"};
  &:hover {
    color: #4a98f7;
  }
  & span {
    font-size: 20px;
    text-transform: capitalize;
  }
`;

export const SliderRange = styled.input``;

export const Button = styled.button`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: #4a98f7;
  color: white;
  font-size: 18px;
  cursor: pointer;
  border: none;
  outline: none;
  &:hover {
    background-color: #3a7ed0;
  }
`;

export const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  background-color: white;
  border-radius: 8px;
  & canvas {
    width: 100%;
    height: 100%;
  }
`;

export const ColorsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

interface ColorProps {
  color?: string;
  active?: boolean;
}

export const Color = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props: ColorProps) => props.color || "black"};
  cursor: pointer;

  border: ${(props: ColorProps) => props.color === "white" && "1px solid #333"};
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 80%;
    height: 80%;
    border: 2px solid #fff;
    border-radius: 50%;
    background-color: inherit;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.2s ease-in-out;
    opacity: ${(props: ColorProps) => (props.active ? 1 : 0)};
  }
`;

export const ColorPicker = styled.input`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props: ColorProps) => props.color || "black"};
  cursor: pointer;
  border: none;
  outline: none;
  -webkit-appearance: none;
  border: none;
  &::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 50%;
  }
  &::-webkit-color-swatch {
    border-radius: 50%;
  }
`;
