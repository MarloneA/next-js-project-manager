'use client'

import { useBoardStore } from '@/store/BoardStore';
import { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function Board() {

  const [board, getBoard] = useBoardStore((state) => [state.board, state.getBoard])
  console.log('board: ', board);

  useEffect(() => {
    getBoard()
  }, [getBoard])



  return (
    // <DragDropContext>
    //   <Droppable droppableId='board' direction='horizontal' type="column">
    //     {(provided) =>
    //       <div>
    //         my content
    //       </div>
    //     }
    //   </Droppable>
    // </DragDropContext>
    <div>content</div>
  );
}

export default Board;