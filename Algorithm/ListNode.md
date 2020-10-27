<div align="center"><h1>LeetCode链表题汇总</h1></div>

主要的思想方法有：

- 递归
- 双指针
- 双链表 + 哈希表



# 反转链表题型

## 1. 反转单链表 

**[LeetCode206](https://leetcode-cn.com/problems/reverse-linked-list/)**：

![image-20201027234444006](ListNode.assets/image-20201027234444006.png)

```js
// 递归
var reverseList = function(head) {
  let current = head;
  let prev = null;
  while(current){
    let tmp = current.next;
    current.next = prev;
    prev = current;
    current = tmp;
  }
  return prev; // 注意prev才是现在的current, 并且head已经变成链尾的1了
};
```



## 2. 反转m到n段链表

**[LeetCode92](https://leetcode-cn.com/problems/reverse-linked-list-ii/)**：

![image-20201027235220884](ListNode.assets/image-20201027235220884.png)

```js
var reverseBetween = function(head, m, n) {
  // 设置链表头的原因：如果是[5]这个链表，没办法取到h.next.next会报错，设置链表头可以避免这个问题
  let hair = new ListNode(0);
  hair.next = head;
  let h = hair;
  for(let i=0;i<m-1;i++){
    h = h.next;
  }
  let current = h.next;
  let prev = null;
  for(let i=0;i<=n-m;i++){
    let tmp = current.next;
    current.next = prev;
    prev = current;
    current = tmp;
  }
  h.next.next = current;
  h.next = prev;
  return hair.next
};
```



## 3. K个一组反转链表

[LeetCode25](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/)：

![image-20201027235504095](ListNode.assets/image-20201027235504095.png)

```javascript
var reverseKGroup = function (head, k) {
  // 计算长度是否满足k
  let p = head; // 用来计算是否满足k的节点p
  let count = 1;
  while (count <= k) {
    if (!p) return head; // 不满足就返回原node
    p = p.next;
    count += 1;
  }
  // 对k个进行翻转, k以外的进行迭代
  let current = head; // 用来翻转的tmp
  let prev = null;
  for (let i = 1; i <= k; i++) {
    let tmp = current.next;
    current.next = prev;
    prev = current;
    current = tmp;
  }
  head.next = reverseKGroup(current, k); // current已经变成了next
  return prev; // prev才是current
};
```

