const Background: React.FC = () => {
  return (
    <div className="bg-zinc-950 fixed inset-0 -z-40 rotate-y-180">
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
        className="absolute right-0 top-0 -z-30 h-full w-1/2 bg-zinc-950"
      >
        <div
          style={{
            backgroundImage:
              "radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))",
          }}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
};

export default Background;
