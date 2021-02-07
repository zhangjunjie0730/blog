# 问题汇总

nSum 问题属于 Leetcode 中的系列问题，简单来说就是求数组中子元素的和达到 `target` 的所有排列。乍一看，用穷举似乎能简单完成，但如果是 10Sum 、100Sum，这种穷举方法就很繁琐了。我们就需要探索出最简单的通用方法。

- [两数之和](https://leetcode-cn.com/problems/two-sum/)
- [三数之和](https://leetcode-cn.com/problems/3sum/)
- [四数之和](https://leetcode-cn.com/problems/4sum/)

# 两数之和

## 题目

```js
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
你可以按任意顺序返回答案。
示例：
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

## 思路

### 穷举法

穷举法就不说了，也就是两层遍历，然后判断，返回结果。能优化的穷举法无非是加个 `memo` 哈希表，存入已经算过的组合。

```js
var twoSum = function(nums, target) {
  const memo = {};
  for(let i=0;i<nums.length;i++){
    if(memo[i]) return [i, memo[nums[i]]];
    else memo[i] = nums.indexOf(target-nums[i]) === -1 ? undefined :  nums.indexOf(target-nums[i]) === -1
  }
};
```

### 双指针法

这道题换种想法也是双指针夹逼的经典思路。左右指针相向而行，找到 `target` 。但要注意个细节问题，如果判断移动左指针还是右指针？我们可以先对数组进行从小到大排列，这样通过与 `target` 的大小比较，就能知道是增加还是减少。

```js
var twoSum = function(nums, target) {
  nums.sort((a,b)=>a-b);
  let left =0, right = nums.length-1;
  while(left<right){
    let sum = nums[left]+nums[right];
    if(sum<target) left++;
    else if(sum>target) right--;
    else return [left, right];
  }
  return [];
};
```

**这道题不能用这个方法，因为他要求返回下标值，所以应该只能使用暴力法或者进行一定的优化。如果返回的是数组的值，用双指针没有问题。**

# 3Sum

## 题目

```js
给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0？请你找出所有和为 0 且不重复的三元组。注意：答案中不可以包含重复的三元组。
示例：
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
```

## 思路



















