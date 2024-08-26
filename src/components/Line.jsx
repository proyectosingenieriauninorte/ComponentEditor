export default function Line({ data }) {
    return (
      <path
        d={`M ${data.startX} ${data.startY} L ${data.endX} ${data.endY}`}
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
    );
  }
  