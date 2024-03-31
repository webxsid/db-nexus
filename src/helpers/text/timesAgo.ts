const timeAgo = (date: Date | null): string => {
  if (!date) return "Never";
  const currentDate = new Date();
  const pastDate = new Date(date);
  const seconds = Math.floor(
    (currentDate.getTime() - pastDate.getTime()) / 1000
  );
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years ago`;
  }
  if (interval === 1) {
    return "1 year ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months ago`;
  }
  if (interval === 1) {
    return "1 month ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days ago`;
  }
  if (interval === 1) {
    return "1 day ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours ago`;
  }
  if (interval === 1) {
    return "1 hour ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes ago`;
  }
  if (interval === 1) {
    return "1 minute ago";
  }
  if (Math.floor(seconds) < 5) {
    return "Just now";
  }
  return `${Math.floor(seconds)} seconds ago`;
};

export default timeAgo;
