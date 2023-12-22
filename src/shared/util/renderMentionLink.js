import { Link } from "@mui/material";

const renderMentionLink = (content) => {
  const mentionRegex = /@([\w.]+)/g;
  const mentions = content.match(mentionRegex);

  if (!mentions) {
    return <>{content}</>;
  }

  const renderedContent = content.split(mentionRegex).map((part, index) => {
    if (index % 2 === 0) {
      return <span key={index}>{part}</span>;
    } else {
      const username = part.slice(0, part.length);
      const isValidUsername = /^[\w._]+$/.test(username);

      if (isValidUsername) {
        return (
          <Link
            key={index}
            to={`/${username}/`}
            style={{
              color: "#E0F1FF",
              textDecoration: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            @{username}
          </Link>
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    }
  });

  return <>{renderedContent}</>;
};

export default renderMentionLink;
