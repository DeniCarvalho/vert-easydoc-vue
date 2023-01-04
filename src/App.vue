<template>
  <div
    class="ved-container sm:ved-mx-auto ved-w-auto sm:ved-w-2/3 ved-px-5 sm:ved-px-0 ved-flex ved-flex-col ved-overflow-auto ved-pb-16"
  >
    <h1 class="ved-text-center">VERT Sign</h1>

    <div class="ved-w-full ved-my-4">
      <h4 class="ved-text-primaryPure ved-p-0 ved-pb-2 ved-m-0">Small</h4>
      <div class="ved-w-full ved-h-px ved-bg-primaryPure"></div>
    </div>
    <VInputFile
      :size="SizeEnum.Small"
      :labels="config.labels"
      :settings="config.settings"
      :colors="config.colors"
      :hasFile="urlFileSmall"
      :loading="loadingSmall"
      :fileName="fileNameSmall"
      :parties="[
        {
          name: 'Denisson dos Santos Carvalgo da Silva',
          email: 'denii@gmail.com',
        },
        {
          name: 'Caroline',
          email: 'carol@gmail.com',
        },
      ]"
      @send="sendSmall"
      @remove="urlFileSmall = false"
      @download="downloadFile"
    />
    <div class="ved-w-full ved-my-4 ved-mt-10">
      <h4 class="ved-text-primaryPure ved-p-0 ved-pb-2 ved-m-0">Medium</h4>
      <div class="ved-w-full ved-h-px ved-bg-primaryPure"></div>
    </div>
    <VInputFile
      :labels="config.labels"
      :settings="config.settings"
      :colors="config.colors"
      :hasFile="urlFileMedium"
      :loading="loadingMedium"
      :fileName="fileNameMedium"
      @send="sendMedium"
      @remove="urlFileMedium = false"
      @download="downloadFile"
    />

    <div class="ved-w-full ved-my-4 ved-mt-10">
      <h4 class="ved-text-primaryPure ved-p-0 ved-pb-2 ved-m-0">Large</h4>
      <div class="ved-w-full ved-h-px ved-bg-primaryPure"></div>
    </div>

    <VInputFile
      :size="SizeEnum.Large"
      :labels="config.labels"
      :settings="config.settings"
      :colors="config.colors"
      :hasFile="urlFileLarge"
      :loading="loadingLarge"
      :fileName="fileNameLarge"
      @send="sendLarge"
      @remove="urlFileLarge = false"
      @download="downloadFile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { VInputFile } from '@/components';
import { SizeEnum } from '@/enums/size.enum';
import { url } from 'inspector';
export default defineComponent({
  name: 'App',
  components: {
    VInputFile,
  },
  setup() {
    const config = reactive({
      colors: {
        // primary: 'rgb(22 114 181)',
      },
      labels: {
        browserLink: 'Clique',
        dragDrop: 'ou arraste o documento',
        supportedTypes: 'Suporta',
        maxSize: 'Tamanho',
      },
      settings: {
        endpoint: 'http://localhost:5005/api/v1/upload',
        // maxSize: '12MB',
      },
    });

    const loadingSmall = ref(false);
    const urlFileSmall = ref<boolean>(false);
    const fileNameSmall = ref<string>('');

    const loadingMedium = ref(false);
    const fileNameMedium = ref<string>('');
    const urlFileMedium = ref<boolean>(false);

    const loadingLarge = ref(false);
    const fileNameLarge = ref<string>('');
    const urlFileLarge = ref<boolean>(false);

    const request = ref<XMLHttpRequest>(new XMLHttpRequest());

    const sendSmall = (data: any) => {
      loadingSmall.value = true;
      sendRequest(
        data,
        (res: any) => {
          console.log(res);
          fileNameSmall.value = data.name;
          urlFileSmall.value = true;
          loadingSmall.value = false;
        },
        (error: any) => {
          loadingSmall.value = false;
          console.log(error);
        }
      );
    };
    const sendMedium = (data: any) => {
      loadingMedium.value = true;
      sendRequest(
        data,
        (res: any) => {
          console.log(res);
          fileNameMedium.value = data.name;
          urlFileMedium.value = true;
          loadingMedium.value = false;
        },
        (error: any) => {
          loadingMedium.value = false;
          console.log(error);
        }
      );
    };
    const sendLarge = (data: any) => {
      loadingLarge.value = true;
      sendRequest(
        data,
        (res: any) => {
          console.log(res);
          fileNameLarge.value = data.name;
          urlFileLarge.value = true;
          loadingLarge.value = false;
        },
        (error: any) => {
          loadingLarge.value = false;
          console.log(error);
        }
      );
    };

    const sendRequest = (data: any, callback: any, error?: any) => {
      request.value = new XMLHttpRequest();

      request.value.addEventListener('load', function () {
        if (request.value.status == 200) {
          const data = JSON.parse(request.value.response);
          callback(data);
        } else {
          error(request.value);
        }
      });

      request.value.open('POST', 'http://localhost:9001/envelope');

      const documentId = '1';
      const signers = [];
      for (let index = 0; index < data.signers.length; index++) {
        const sign = data.signers[index];
        const recipientId = (index + 1).toString();
        const clientUserId = new Date().getTime().toString();
        signers.push({
          name: sign.name,
          email: sign.email,
          recipientId: recipientId,
          clientUserId: clientUserId,
          tabs: {
            signHereTabs: sign.signHereTabs.map((tab: any) => {
              return {
                documentId: documentId,
                pageNumber: tab.page.toString(),
                xPosition: tab.xPosition.toString(),
                yPosition: tab.yPosition.toString(),
                recipientId: recipientId,
                tabLabel: 'SignHereTab',
              };
            }),
          },
        });
      }

      const payload = {
        documents: [
          {
            name: data.name,
            documentBase64: data.file,
            documentId: documentId,
          },
        ],
        emailSubject: 'Contrato LIFT',
        recipients: {
          signers: signers,
        },
        type: data.type,
      };
      request.value.send(JSON.stringify(payload));
    };

    const downloadFile = async () => {
      try {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.target = '_blank';
        a.href =
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        a.download = `contrato.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        );
      } catch (error) {}
    };

    return {
      config,
      SizeEnum,
      loadingSmall,
      urlFileSmall,
      fileNameSmall,
      urlFileMedium,
      loadingMedium,
      fileNameMedium,
      urlFileLarge,
      loadingLarge,
      fileNameLarge,
      sendSmall,
      sendMedium,
      sendLarge,
      downloadFile,
    };
  },
});
</script>
<style lang="scss">
@import '@/assets/styles/_font';

html,
body {
  font-family: 'Open Sans', sans-serif !important;
  overflow: auto;
}
</style>
