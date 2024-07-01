/* eslint-disable @typescript-eslint/no-explicit-any */
import { chakra } from "@chakra-ui/react";

interface Props {
  width: any;
  height: any;
}

export default function Logo({ width, height }: Props) {
  return (
    <chakra.svg
      width={width}
      height={height}
      viewBox="0 0 800 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="300" fill="url(#paint0_diamond_2_2)" />
      <path
        d="M276.623 197V103.909H287.895V150.091H288.986L330.805 103.909H345.532L306.441 145.909L345.532 197H331.895L299.532 153.727L287.895 166.818V197H276.623ZM398.523 197V103.909H454.341V113.909H409.795V145.364H450.159V155.364H409.795V197H398.523ZM523.32 103.909V197H512.048V103.909H523.32Z"
        fill="#F5F5F5"
      />
      <defs>
        <radialGradient
          id="paint0_diamond_2_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(400 151.875) rotate(20.3202) scale(426.545 453.666)"
        >
          <stop stopColor="#066B65" />
          <stop offset="1" stopColor="#021C17" />
        </radialGradient>
      </defs>
    </chakra.svg>
  );
}
