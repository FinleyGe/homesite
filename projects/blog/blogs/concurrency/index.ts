import zh from './zh.mdx'
// import en from './en.mdx'
import type { Blog } from '../type'

export default <Blog>{
  title: {
    'zh': '线程、进程、协程',
    'en': 'Threads, Processes, Coroutines'
  },
  link: 'thread-process-coroutine',
  date: '2023-06-29',
  lang: ['zh'],
  content: {
    'en': zh,
    'zh': zh
  },
  description: {
    'zh': '程序的并发实现方式，常见的无非如题所述的三种：线程、进程和协程。本文将总结三者的区别，以及在 python 和 golang 等语言中的实际应用。',
    'en': 'The concurrency implementation of the program, the commonly mentioned three: threads, processes, and coroutines. This article summarizes the differences between them and the actual application in python and golang.'
  },
  tag: ['backend', 'code', 'migration']
};
