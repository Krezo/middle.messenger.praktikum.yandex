;<Modal
  close={() => (createChatModalOpen.value = false)}
  title="Создание чата"
  open={createChatModalOpen.value}
>
  <form onSubmit={createChat} className={style.createChatForm}>
    <div className={styles.formErrorMessage}>{chatStore.createChatError}</div>
    <Input
      id="create_chat_name"
      setValue={(value) => (createChatName.value = value)}
      placeholder="Введите название чата"
    />
    <Button loading={chatStore.loadingCreateChat} type="submit" primary>
      Создать
    </Button>
  </form>
</Modal>
