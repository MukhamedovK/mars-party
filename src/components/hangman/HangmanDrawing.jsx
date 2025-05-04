const BODY_PARTS = [
    <div className="w-16 h-16 rounded-full border-8 border-primary absolute top-12 -right-12 bg-base-200 animate-wiggle shadow-md" />,
    <div className="w-4 h-32 bg-primary absolute top-32 right-0 rounded-lg shadow-sm" />,
    <div className="w-28 h-4 bg-primary absolute top-48 -right-28 -rotate-30 origin-left rounded-lg shadow-sm" />,
    <div className="w-28 h-4 bg-primary absolute top-48 right-4 rotate-30 origin-right rounded-lg shadow-sm" />,
    <div className="w-28 h-4 bg-primary absolute top-72 -right-24 rotate-45 origin-left rounded-lg shadow-sm" />,
    <div className="w-28 h-4 bg-primary absolute top-72 right-0 -rotate-45 origin-right rounded-lg shadow-sm" />,
  ];
  
  export function HangmanDrawing({ numberOfGuesses }) {
    return (
      <div className="relative w-80 h-[28rem] transition-all duration-300 hover:scale-105 mx-auto">
        {BODY_PARTS.slice(0, numberOfGuesses)}
        <div className="w-4 h-16 bg-neutral absolute top-0 right-0 rounded-t-lg" />
        <div className="w-56 h-4 bg-neutral ml-28 rounded-lg" />
        <div className="w-4 h-[28rem] bg-neutral ml-28 rounded-b-lg" />
        <div className="w-80 h-4 bg-neutral rounded-lg" />
      </div>
    );
  }