type PinyinRubyProps = {
  className?: string;
  pinyin: string;
  text: string;
};

function isHan(char: string) {
  return /\p{Script=Han}/u.test(char);
}

export function PinyinRuby({ className, pinyin, text }: PinyinRubyProps) {
  const syllables = pinyin.trim().split(/\s+/).filter(Boolean);
  let syllableIndex = 0;

  return (
    <span className={className}>
      {[...text].map((char, index) => {
        if (!isHan(char)) return <span key={`${char}-${index}`}>{char}</span>;

        const syllable = syllables[syllableIndex++];
        if (!syllable) return <span key={`${char}-${index}`}>{char}</span>;

        return (
          <ruby className="pinyin-ruby" key={`${char}-${index}`}>
            {char}
            <rt>{syllable}</rt>
          </ruby>
        );
      })}
    </span>
  );
}
