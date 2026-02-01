const TAG_STYLES = {
  Java: "text-sky-700 bg-sky-100",
  JSP: "text-sky-700 bg-sky-100",
  Spring: "text-sky-700 bg-sky-100",
  JavaScript: "text-teal-700 bg-teal-100",
  JAVASCRIPT: "text-teal-700 bg-teal-100",
  MySQL: "text-amber-700 bg-amber-100",
  SQLite: "text-amber-700 bg-amber-100",
  Mybatis: "text-amber-700 bg-amber-100",
  HTML: "text-emerald-700 bg-emerald-100",
  CSS: "text-emerald-700 bg-emerald-100",
  Android: "text-emerald-700 bg-emerald-100",
};

export function TagBadge({ label }) {
  const style = TAG_STYLES[label] || "text-slate-700 bg-slate-100";
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

export function getTags(tag) {
  return <TagBadge label={tag} />;
}
