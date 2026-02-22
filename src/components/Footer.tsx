

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {currentYear} Universal Data Converter. All rights reserved.</p>
    </footer>
  );
}
