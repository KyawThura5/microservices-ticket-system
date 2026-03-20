export function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize;
  return list.slice(start, start + pageSize);
}

export function clampPage(page, total, pageSize) {
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  return Math.min(Math.max(page, 1), maxPage);
}
