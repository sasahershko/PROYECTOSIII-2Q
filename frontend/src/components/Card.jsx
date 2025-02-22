export default function Card({ children }) {
  return (
    <div className="bg-card rounded-lg shadow-lg p-8 text-center">
      {children}
    </div>
  );
}
