// railsのcreated_atなどの時間表記を変える
export function dateTime (railsTime) {
  const reg = /^(\d{4})-(\d{2})-(\d{1,2})T/
  const matched = railsTime.match(reg)
  return `${matched[1]} ${matched[2]}/${matched[3]}`
}
