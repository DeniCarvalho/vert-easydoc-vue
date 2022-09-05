<template>
  <div id="input-file-ved" ref="inputFileVed" class="ved-w-full ved-relative">
    <label
      @mouseenter="start"
      @mouseleave="reverse"
      @dragover.prevent="start"
      @dragleave.prevent="reverse"
      @drop.prevent="onDrop"
      for="select-file"
      :class="{
        'hover:ved-border-primaryPure hover:ved-bg-primaryPureLight': isHover,
      }"
      class="ved-w-auto ved-h-auto ved-relative ved-group ved-py-5 ved-flex ved-flex-col ved-justify-center ved-cursor-pointer ved-items-center ved-border-2 ved-rounded-lg ved-border-disabledPure ved-border-dashed ved-duration-1000"
    >
      <lottie-animation
        id="anim-ref-ved"
        ref="animRef"
        :loop="false"
        :autoPlay="false"
        :speed="1"
        :animationData="animationData"
        @complete="complete"
        class="ved-h-28"
      />

      <div
        class="ved-text-primary ved-text-center ved-text-sm sm:ved-text-base"
      >
        <span class="ved-cursor-pointer ved-font-bold ved-text-primaryPure">
          {{ configComponent.labels.browserLink }}
        </span>
        {{ configComponent.labels.dragDrop }}
      </div>
      <div class="ved-text-fontLight ved-text-xs ved-mt-1 ved-text-center">
        {{ configComponent.labels.supportedTypes }}:
        {{ configComponent.settings.supportedTypes }}
      </div>
      <div class="ved-text-fontLight ved-text-xs ved-text-center">
        {{ configComponent.labels.maxSize }}:
        {{ configComponent.settings.maxSize }}
      </div>

      <div
        id="info-icon-ved"
        class="ved-absolute ved-top-2 ved-right-2 ved-cursor-pointer"
      >
        <div class="icon-ved ved-absolute ved-z-50 ved-text-xs">&#8505;</div>
        <div class="blob-ved color-ved ved-relative ved-z-40"></div>
      </div>
    </label>
    <input
      ref="fileRef"
      hidden
      id="select-file"
      type="file"
      name="select-file"
      accept=".doc,.docx,application/pdf"
    />
    <div
      class="ved-w-auto ved-h-auto ved-relative ved-flex ved-justify-between ved-items-center ved-p-2 ved-rounded-lg ved-bg-primaryPureLight ved-mt-1 ved-border-0 ved-border-l-4 ved-border-primaryPure"
    >
      <div class="ved-w-auto ved-flex ved-items-center">
        <Icon :icon="CheckCircle" class="ved-text-success ved-h-6" />
        <div class="ved-text-primaryPure ved-cursor-pointer ved-ml-2">
          {{ fileName }}
        </div>
      </div>
      <div class="ved-w-auto ved-flex ved-items-center">
        <Icon
          :icon="Download"
          :size="18"
          class="ved-text-primaryPure ved-mr-2"
        />
        <Icon :icon="TrashCan" :size="18" class="ved-text-primaryPure" />
      </div>
    </div>
    <Modal ref="modalRef" :file="document" />
  </div>
</template>
<style lang="scss" src="./VInputFile.scss" />
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from 'vue';
import CheckCircle from 'vue-material-design-icons/CheckCircle.vue';
import TrashCan from 'vue-material-design-icons/TrashCan.vue';
import Download from 'vue-material-design-icons/Download.vue';
import { Modal, Icon } from '../../widgets';
import animationData from '@/assets/animation/upload-file.json';
import { IPage, PageModel } from '@/models/page.model';
import { DocumentModel, IDocument } from '@/models/document.model';
import { SizeEnum } from '@/enums/size.enum';

export default defineComponent({
  name: 'VSInput',
  components: { Icon, Modal },
  props: {
    fileName: {
      type: String,
      default: 'Document template',
    },
    settings: {
      type: Object as () => {
        supportedTypes?: string;
        maxSize?: string;
        endpoint?: string;
        apiToken?: string;
      },
      required: false,
    },
    colors: {
      type: Object as () => {
        primary?: string;
        secondary?: string;
      },
      required: false,
    },
    labels: {
      type: Object as () => {
        browserLink?: string;
        dragDrop?: string;
        supportedTypes?: string;
        maxSize?: string;
      },
      required: false,
    },
    size: {
      type: String as PropType<SizeEnum>,
      default: SizeEnum.Medium,
    },
  },
  setup(props) {
    const configComponent = ref<any>({
      settings: {
        ...{
          supportedTypes: 'PDF, DOCX, DOC',
          maxSize: '10MB',
          endpoint: 'https://api.ved.com.br/v1/upload',
          apiToken: '',
        },
        ...props.settings,
      },
      labels: {
        ...{
          browserLink: 'Click',
          dragDrop: 'or drag the document',
          supportedTypes: 'Supports',
          maxSize: 'Size',
        },
        ...props.labels,
      },
      colors: {
        ...{
          primary: null,
          secondary: null,
        },
        ...props.colors,
      },
      size: props.size,
    });

    watch(
      () => props,
      (value) => {
        if (value) {
          configComponent.value = {
            ...configComponent.value,
            ...value,
          };
        }
      }
    );

    const inputFileVed = ref<HTMLDivElement | null>(null);
    const animRef = ref<any>(null);
    const fileRef = ref<any>(null);
    const modalRef = ref<any>(null);
    const isHover = ref(false);

    const documentFile = ref<File>();
    const document = ref<IDocument>();

    const start = () => {
      isHover.value = true;
      animRef.value?.setDirection(1);
      animRef.value?.play();
    };
    const complete = () => {
      animRef.value?.pause();
    };

    const reverse = () => {
      isHover.value = false;
      animRef.value?.setDirection(-1);
      animRef.value?.play();
    };

    const close = () => {
      modalRef.value?.close();
    };

    const onFile = async (file: File) => {
      try {
        const blob = file.slice(0, file.size, file.type);
        const extension = file.name.split('.').pop();
        const name = file.name.split('.').shift();

        documentFile.value = new File([blob], `${name}.${extension}`, {
          type: file.type,
        });
        console.log(documentFile.value);
        const formData = new FormData();
        formData.append('file', documentFile.value);

        const response = await fetch('http://localhost:5005/go', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        const pages: IPage[] = data.pages.map((page: any) =>
          PageModel.fromJson(page)
        );
        document.value = new DocumentModel({
          name: name ?? '',
          extension: extension ?? '',
          pages,
          file: documentFile.value,
        });

        fileRef.value.value = '';
        modalRef.value?.openDocumentRef();
      } catch (error) {
        console.log(error);
      }
    };

    const onFileChange = (e: any) => {
      const file: File = e.target.files[0];
      onFile(file);
    };

    const onDrop = (e: any) => {
      const file: File = e.dataTransfer.files[0];
      onFile(file);
    };

    const preventDefaults = (e: any) => {
      e.preventDefault();
    };

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    onMounted(() => {
      events.forEach((eventName) => {
        const _document = document as any;
        _document?.body?.addEventListener(eventName, preventDefaults);
      });
      fileRef.value.onchange = onFileChange;
    });

    onUnmounted(() => {
      events.forEach((eventName) => {
        const _document = document as any;
        _document?.body?.removeEventListener(eventName, preventDefaults);
      });
    });

    return {
      configComponent,
      inputFileVed,
      animRef,
      fileRef,
      modalRef,
      isHover,
      document,
      animationData,
      start,
      complete,
      reverse,
      onFileChange,
      onDrop,
      close,
      CheckCircle,
      TrashCan,
      Download,
    };
  },
});
</script>
