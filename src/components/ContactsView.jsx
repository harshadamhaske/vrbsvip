import {Text, FlatList, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View} from 'react-native-animatable';

const ContactCard = ({item}) => {
  return (
    <View className="bg-black/[0.7] w-full p-4 rounded-xl flex items-center flex-row border-2 border-white/[0.5]">
      <View className="w-3/4">
        <Text className="text-purple-500 text-2xl">{item.displayName}</Text>
        <Text className="text-purple-500 text-2xl">
          {item.phoneNumbers[0]?.number}
        </Text>
      </View>
      <Avatar item={item} />
    </View>
  );
};

const Avatar = ({item}) => {
  return (
    <View className="w-1/4 rounded-full flex flex-row aspect-square border-2 border-white/[0.5] justify-center bg-gray-700 items-center">
      {item.hasThumbnail ? (
        <Image
          source={{uri: item.thumbnailPath}}
          className="w-full h-full rounded-full"
        />
      ) : (
        <Text className=" w-full rounded-full text-center text-4xl">
          {item.displayName[0]}
        </Text>
      )}
    </View>
  );
};

const Seperator = () => {
  return <View className=" h-5 w-full" />;
};

const ContactsView = () => {
  const SR_Result = useSelector(state => state.voice.SR_Result);

  useEffect(() => {
    console.log(SR_Result);
  }, [SR_Result]);

  return (
    <FlatList
      data={SR_Result}
      renderItem={({item}) => (
        <View className="w-full flex items-center rounded-xl">
          <ContactCard item={item} />
        </View>
      )}
      keyExtractor={(item, index) => index}
      className="w-full flex py-4"
      ItemSeparatorComponent={Seperator}
    />
  );
};

export default ContactsView;
