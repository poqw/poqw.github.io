# Priority Queue

## 개념

Priority Queue는 enqueue할 때는 아무거나 들어오지만 dequeue할 때는 가장 우선순위가 높은 것부터 빠져나간다.
보통 Heap으로 구현한다. Heap 외에도 여러가지 방법으로 구현할 수 있지만 Heap이 가장 효율적이다.

* 배열로 구현하는 경우

    삽입할 때 배열 맨 뒤에 계속 붙인다. => O(1)
    인출할 때 가장 우선 순위가 높은 원소를 찾아 반환한다. => O(n)

* 링크드 리스트로 구현하는 경우

    배열이랑 다를 게 없다. 만약 삽입할 때 우선순위가 가장 높은 원소가 가장 앞으로 오도록 구현하도록 구현하더라도, 삽입시 O(n), 인출 시 O(1)이 되는 것 뿐이다.

* 힙으로 구현하는 경우

    삽입할 때 O(log(n)), 인출할 때 O(log(n))이다. 삽입이나 인출이 일어날 때마다 부모와 자식의 키를 비교하여 완전 이진 트리로 만드는 과정을 거치기 때문이다.

## 구현(Kotlin) - Max Heap

```kotlin
fun main() {

    class Heap {
        private val array = mutableListOf<Int>()

        fun insert(e: Int) {
            array.add(e)
            heapifyOnInsert(e, array.lastIndex)
        }

        private fun heapifyOnInsert(newE: Int, newIndex: Int) {
            val parentIndex = getParentIndex(newIndex)
            if (array[parentIndex] < newE) {
                array[newIndex] = array[parentIndex]
                array[parentIndex] = newE
                heapifyOnInsert(newE, parentIndex)
            }
        }

        fun delete(): Int? {
            val root = array.firstOrNull() ?: return null
            heapifyOnDelete(0)
            array.removeLast()
            return root
        }

        private fun heapifyOnDelete(emptyIndex: Int) {
            val left = getLeftChildIndex(emptyIndex)
            val right = getRightChildIndex(emptyIndex)
            if (left <= array.lastIndex && right <= array.lastIndex) {
                if (array[left] > array[right]) {
                    array[emptyIndex] = array[left]
                    heapifyOnDelete(left)
                } else {
                    array[emptyIndex] = array[right]
                    heapifyOnDelete(right)
                }
                return
            }

            if (left <= array.lastIndex) {
                array[emptyIndex] = array[left]
                return
            }

            if (right <= array.lastIndex) {
                array[emptyIndex] = array[right]
                return
            }

            if (emptyIndex != array.lastIndex) {
                array[emptyIndex] = array.last()
            }
        }

        private fun getLeftChildIndex(idx: Int): Int {
            return (idx + 1) * 2 - 1
        }

        private fun getRightChildIndex(idx: Int): Int {
            return (idx + 1) * 2
        }

        private fun getParentIndex(idx: Int): Int {
            return (idx - 1) / 2
        }

        override fun toString(): String {
            return array.toString()
        }
    }


    val heap = Heap()
    heap.insert(1)
    heap.insert(3)
    heap.insert(4)
    heap.insert(5)
    heap.insert(2)
    heap.insert(7)
    heap.insert(6)
    println(heap.toString())
    heap.delete()
    println(heap.toString())
    heap.delete()
    println(heap.toString())
    heap.delete()
    println(heap.toString())
    heap.delete()
    println(heap.toString())
    heap.delete()
    println(heap.toString())
}
```