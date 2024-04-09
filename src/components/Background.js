export default function Background() {
  return (
    <div className="flex justify-center">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-[150px] h-auto scale-150 opacity-70 rounded-lg"
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_900px_at_40%_700px,#f3e8ff,transparent)]"></div>
      </div>
    </div>
  );
}
