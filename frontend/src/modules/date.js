// railsのcreated_atなどの時間表記を変える
// 2021-09-17T09:46:02.431+09:00 など
export function dateTime (railsTime) {
  const reg = /^(\d{4})-(\d{2})-(\d{1,2})T/
  const matched = railsTime.match(reg)
  return `${matched[1]} ${matched[2]}/${matched[3]}`
}
