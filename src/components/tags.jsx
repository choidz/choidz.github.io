export function getTags(tags) {
  switch (tags) {
    case "Java":
    case "JSP":
    case "Spring":
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100">
          {tags}
        </span>
      );
    case "JAVASCRIPT":
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-teal-600 bg-teal-100">
          {tags}
        </span>
      );
    case "MySQL":
    case "SQLite":
    case "Mybatis":
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-yellow-100">
          {tags}
        </span>
      );
    case "HTML":
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
          {tags}
        </span>
      );
    case "CSS":
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
          {tags}
        </span>
      );
    case "Android":
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100">
          {tags}
        </span>
      );
    default:
      return (
        <span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
          {tags}
        </span>
      );
  }
}
