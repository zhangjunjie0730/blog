class Solution:
  def decodeString(self, s: str) -> str:
    def dfs(start):
      repeat_str = repeat_count = ''
      while start < len(s):
        if s[start].isnumeric():
          repeat_count += s[start]
        elif s[start] == '[':
          # 更新指针
          start, t_str = dfs(start + 1)
          # repeat_count 仅作用于 t_str，而不作于repeat_str
          repeat_str = repeat_str + t_str *(repeat_count)
          repeat_count = ''
        elif s[start] == ']':
          return start, repeat_str
        else:
          repeat_str += s[start]
        start += 1
    return repeat_str
    return dfs(0)