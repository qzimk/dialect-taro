import svgPaths from "./svg-d77lm76qn1";

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Heiti_SC:Medium',sans-serif] leading-[36px] left-0 not-italic text-[#101828] text-[24px] top-[-1.33px]">方言助手</p>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-[126px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <Heading />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1db90b80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#155dfc] h-[40px] relative rounded-[22369600px] shrink-0 w-[120px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon />
        <p className="-translate-x-1/2 absolute font-['Arimo:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-[72px] text-[16px] text-center text-white top-[7px]">普通聊天</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f3f4f6] h-[40px] relative rounded-[22369600px] shrink-0 w-[120px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Arimo:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal leading-[24px] left-[72px] text-[#364153] text-[16px] text-center top-[7px]">方言查询</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[16px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2e68c600} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4f72080} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V14.6667" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f3f4f6] h-[40px] relative rounded-[22369600px] shrink-0 w-[120px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon2 />
        <p className="-translate-x-1/2 absolute font-['Arimo:Regular','Noto_Sans_SC:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[24px] left-[72px] text-[#364153] text-[16px] text-center top-[7px]">实时翻译</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[40px] items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white relative shrink-0 w-[408px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[16px] py-[8px] relative w-full">
        <Container2 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p28a13700} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2a96b00} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-[86px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <p className="-translate-x-1/2 absolute font-['Arimo:Regular','Noto_Sans_SC:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[20px] left-[55px] text-[#0a0a0a] text-[14px] text-center top-[5.33px]">记录本</p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white h-[80.667px] relative shrink-0 w-[1339.333px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[0.667px] px-[16px] relative size-full">
        <Container />
        <Container1 />
        <Button3 />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[70px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-[-0.67px]">回复语言：</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="h-[20px] relative shrink-0 w-[42px]" data-name="Primitive.span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">
        <p className="font-['Arimo:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#0a0a0a] text-[14px] text-center">普通话</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon" opacity="0.5">
          <path d="M4 6L8 10L12 6" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[#f3f3f5] h-[36px] relative rounded-[8px] shrink-0 w-[140px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[12.667px] py-[0.667px] relative size-full">
        <PrimitiveSpan />
        <Icon4 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Text />
      <PrimitiveButton />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[60.667px] items-start left-0 pb-[0.667px] pt-[12px] px-[16px] top-0 w-[1339.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      <Container4 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Arimo:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal leading-[24px] relative shrink-0 text-[#0a0a0a] text-[16px]">你好！我是方言助手，支持多种方言和多语混杂识别。你可以用任何方言或语言跟我聊天。</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute bg-white left-[16px] rounded-[16px] top-[16px] w-[673px]" data-name="Container">
      <div className="content-stretch flex flex-col items-start overflow-clip pb-[12.67px] pt-[12.667px] px-[16.667px] relative rounded-[inherit] w-full">
        <Paragraph />
      </div>
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_-1px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%_54.17%_41.67%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 5.33333">
            <path d={svgPaths.p125eb900} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-[16.67%] right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66674 7.3334">
            <path d={svgPaths.p36c9eb80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_41.67%_79.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 1.33333">
            <path d="M0.666667 0.666667H8.66667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_66.67%_91.67%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-100%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 1.33333">
            <path d="M0.666667 0.666667H1.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-1/2 right-[8.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.00029 8.00015">
            <path d={svgPaths.pc79fe00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[58.33%] right-[16.67%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 1.33333">
            <path d="M0.666667 0.666667H4.66667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%_8.33%_8.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p4611e00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_33.33%_33.33%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p26970a80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[32px] items-center justify-end left-[16px] top-[65.34px] w-[657px]" data-name="Container">
      <Button4 />
      <Button5 />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute bg-[#1c398e] content-stretch flex h-[20px] items-start left-[21px] px-[8px] py-[2px] rounded-[22369600px] top-[7px] w-[52px]" data-name="Text">
      <p className="flex-[1_0_0] font-['Arial:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] leading-[16px] min-h-px min-w-px relative text-[12px] text-white whitespace-pre-wrap" style={{ fontVariationSettings: "\'wght\' 400" }}>
        普通话
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[24px] left-[16px] top-[36px] w-[88px]" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[24px] left-0 text-[16px] text-white top-[-1px]" style={{ fontVariationSettings: "\'wght\' 400" }}>
        啊
      </p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[68px] left-[1227px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-[97px] w-[88px]" data-name="Container" style={{ backgroundImage: "linear-gradient(142.306deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 100%)" }}>
      <Text1 />
      <Paragraph1 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%_54.17%_41.67%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 5.33333">
            <path d={svgPaths.p125eb900} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-[16.67%] right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66674 7.3334">
            <path d={svgPaths.p36c9eb80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_41.67%_79.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 1.33333">
            <path d="M0.666667 0.666667H8.66667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_66.67%_91.67%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-100%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 1.33333">
            <path d="M0.666667 0.666667H1.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-1/2 right-[8.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.00029 8.00015">
            <path d={svgPaths.pc79fe00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[58.33%] right-[16.67%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 1.33333">
            <path d="M0.666667 0.666667H4.66667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%_8.33%_8.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p4611e00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_33.33%_33.33%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p26970a80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon8 />
      </div>
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/2 left-[12.5%] right-[12.5%] top-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-4.44%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3334 7.33333">
            <path d={svgPaths.p1ff7b880} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_12.5%_66.67%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-20%_-16%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.5 4.66667">
            <path d="M4.83333 0.666667V4H0.666667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[12.5%] left-[12.5%] right-[12.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-11.11%_-4.44%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3334 7.33333">
            <path d={svgPaths.p23e54300} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[66.67%_66.67%_12.5%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-20%_-16%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.5 4.66667">
            <path d="M4.83333 0.666667H0.666667V4" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative rounded-[4px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[32.667px] items-center left-[1227px] top-[175px] w-[88px]" data-name="Container">
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] leading-[24px] left-0 text-[#0a0a0a] text-[16px] top-[-1px]" style={{ fontVariationSettings: "\'wght\' 400" }}>
        收到！检测到您使用的是普通话。回复：啊（已翻译为普通话）
      </p>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[48px] items-start left-[16px] pb-[0.667px] pt-[12.667px] px-[16.667px] rounded-[16px] top-[275px] w-[481px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Paragraph2 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%_54.17%_41.67%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 5.33333">
            <path d={svgPaths.p125eb900} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[41.67%] left-[16.67%] right-1/2 top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-11.11%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66674 7.3334">
            <path d={svgPaths.p36c9eb80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_41.67%_79.17%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 1.33333">
            <path d="M0.666667 0.666667H8.66667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_66.67%_91.67%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-0.67px_-100%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 1.33333">
            <path d="M0.666667 0.666667H1.33333" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-1/2 right-[8.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-10%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.00029 8.00015">
            <path d={svgPaths.pc79fe00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[58.33%] right-[16.67%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.67px_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.33333 1.33333">
            <path d="M0.666667 0.666667H4.66667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.66%_54.17%_16.65%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-11.11%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33333 12.004">
            <path d={svgPaths.p27232800} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_29.17%_37.5%_66.67%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-100%_-16.67%_-100.01%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.00004 5.33341">
            <path d={svgPaths.p3dd33d10} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[23.48%_8.33%_23.48%_80.68%]" data-name="Vector">
        <div className="absolute inset-[-7.86%_-37.94%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.09072 9.81867">
            <path d={svgPaths.p33513d80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%_8.33%_8.33%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p4611e00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_33.33%_33.33%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
            <path d={svgPaths.p26970a80} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon12 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex gap-[6px] h-[32.667px] items-center justify-end left-[33px] top-[323px] w-[448px]" data-name="Container">
      <Button9 />
      <Button10 />
      <Button11 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[657px] left-0 overflow-clip top-[60.33px] w-[1339px]" data-name="Container">
      <Container6 />
      <Container7 />
      <Container8 />
      <Container9 />
      <Container10 />
      <Container11 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2e68c600} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4f72080} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 12.6667V14.6667" id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[0.667px] relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f3f3f5] flex-[1_0_0] h-[36px] min-h-px min-w-px relative rounded-[8px]" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Arimo:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[14px]">输入消息...支持方言和多语混杂</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_2036_146)" id="Icon">
          <path d={svgPaths.p9b47a00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p15e62a80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_2036_146">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="bg-[#030213] relative rounded-[8px] shrink-0 size-[36px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[8px] h-[36px] items-center relative shrink-0 w-full" data-name="Container">
      <Button12 />
      <Input />
      <Button13 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Arimo:Regular','Noto_Sans_JP:Regular','Noto_Sans_SC:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px relative text-[#6a7282] text-[12px] whitespace-pre-wrap">提示：可以在普通话中混入方言词汇，或在方言中混入非中文，系统会自动识别</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[8px] h-[84.667px] items-start left-0 pt-[12.667px] px-[16px] top-[717.33px] w-[1339.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t-[0.667px] inset-0 pointer-events-none" />
      <Container13 />
      <Paragraph3 />
    </div>
  );
}

function ChatMode() {
  return (
    <div className="h-[802px] relative shrink-0 w-[1339px]" data-name="ChatMode">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Container3 />
        <Container5 />
        <Container12 />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#f9fafb] content-stretch flex flex-col h-[883.333px] items-start relative shrink-0 w-full" data-name="App">
      <Header />
      <ChatMode />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="普通聊天">
      <App />
    </div>
  );
}