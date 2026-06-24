import { PermissionsAndroid, Platform } from 'react-native';
import { STRINGS } from 'config';
import ReactNativeBlobUtil, {
  ReactNativeBlobUtilConfig,
} from 'react-native-blob-util';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { AppLog, TAG } from 'utils/Util';
import SimpleToast from 'react-native-simple-toast';

async function requestPermissions() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: STRINGS.puchInAndOut.title_permission,
        message: STRINGS.puchInAndOut.subtext_permissions,
        buttonPositive: STRINGS.puchInAndOut.btntext_permission,
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
  } catch (err) {
    AppLog.log(() => `storage permission ${err}`, TAG.AUTHENTICATION);
  }
}

const useSaveImageGallery = () => {
  async function saveImage(
    setShowSignoutDialog: (value: boolean) => void,
    ImgUrl: string,
    setDownloadDialog: (value: boolean) => void,
    setImageSaveLoading: (value: boolean) => void,
  ): Promise<void> {
    setShowSignoutDialog(false);
    setImageSaveLoading(true);
    let date = new Date();
    let newImgUri = ImgUrl?.lastIndexOf('/');
    let imageName = ImgUrl?.substring(newImgUri!);

    let dirs = ReactNativeBlobUtil.fs.dirs;
    let path =
      dirs.PictureDir +
      '/Image_' +
      Math.floor(date.getTime() + date.getSeconds() / 2) +
      imageName;

    const configOptions: ReactNativeBlobUtilConfig | undefined =
      Platform.select({
        android: {
          fileCache: false,
          indicator: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: path,
            description: 'Image',
          },
        },
      });
    if (ImgUrl) {
      if (Platform.OS === 'android') {
        const granted = await requestPermissions();
        if (granted) {
          ReactNativeBlobUtil.config(configOptions!)
            .fetch('GET', ImgUrl)
            .then(res => {
              setImageSaveLoading(false);
              setDownloadDialog(true);
              AppLog.log(() => `Img saved sucess ${res}`, TAG.AUTHENTICATION);
            })
            .catch(err => {
              setImageSaveLoading(false);
              AppLog.log(
                () => `Download error ${err.message}`,
                TAG.AUTHENTICATION,
              );
            });
        }
      } else {
        CameraRoll.save(ImgUrl)
          .then(res => {
            setImageSaveLoading(false);
            setDownloadDialog(true);
            AppLog.log(() => `Img saved sucess ${res}`, TAG.AUTHENTICATION);
          })
          .catch(err => {
            setImageSaveLoading(false);
            AppLog.log(() => `Download error ${err}`, TAG.AUTHENTICATION);
          });
      }
    } else {
      SimpleToast.show('Image url not found');
    }
  }
  return {
    saveImage,
  };
};
export default useSaveImageGallery;
