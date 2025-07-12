'use client';

import React, { useState } from 'react';
import { PromptHeader, PromptTable } from './components';
import { usePromptManagement } from './hooks/usePromptManagement';

export default function Prompt_Mng() {
  const [isAdding, setIsAdding] = useState(false);

  const {
    prompts,
    isPending,
    modifiedPrompts,
    editingIdx,
    deletingOrderNos,
    changedItems,
    animatingOrderNo,
    animationDirection,
    addMutate,
    handleMoveUp,
    handleMoveDown,
    handleEditClick,
    handlePromptChange,
    handleEditCancel,
    handleApplyChanges,
    handleDeleteClick,
    handleDeleteCancel,
    handleCancelAll,
    handleSaveChanges,
  } = usePromptManagement();

  return (
    <>
      <PromptHeader
        isAdding={isAdding}
        editingIdx={editingIdx}
        changedItems={changedItems}
        deletingOrderNos={deletingOrderNos}
        onAddClick={() => setIsAdding(true)}
        onCancel={handleCancelAll}
        onSave={handleSaveChanges}
      />

      <PromptTable
        prompts={prompts}
        isPending={isPending}
        modifiedPrompts={modifiedPrompts}
        editingIdx={editingIdx}
        deletingOrderNos={deletingOrderNos}
        changedItems={changedItems}
        animatingOrderNo={animatingOrderNo}
        animationDirection={animationDirection}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onEditClick={handleEditClick}
        onPromptChange={handlePromptChange}
        onEditCancel={handleEditCancel}
        onApplyChanges={handleApplyChanges}
        onDeleteClick={handleDeleteClick}
        onDeleteCancel={handleDeleteCancel}
        isAdding={isAdding}
        addMutate={addMutate}
        onAddCancel={() => setIsAdding(false)}
        onAdd={(prompt) => {
          addMutate.mutate(prompt);
          setIsAdding(false);
        }}
      />
    </>
  );
}
